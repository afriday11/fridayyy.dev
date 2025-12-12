---
pubDate: 2025-06-14
layout: ../../layouts/PostLayout.astro
thumbnail: /gallery/pixelsocket_thumbnail.png
title: "Pixel Socket"
description: "Multi-player pixel art application over WebSockets"
categories: [full-stack, react, tools]
priority: 50
---

# Pixel Socket

A real-time multiplayer pixel art canvas using React, Canvas2d, and Socket.io

- **Live Demo:** https://pixel-socket.onrender.com/
- **Github Repo** https://github.com/DanFessler/pixel-socket

## Motivation

I host an annual "Art Jam" at GDC. I wanted to make a pixel art application that all attendees could connect to and draw together in real-time while it was projected onto a large screen for everyone to see. It was a fun excuse to get into the weeds of high-performance data-intensive realtime networking.

## Client/Server Architecture

The project leverages Socket.io to enable real-time communication betwen clients and the server.

Clients supply the roomId via the `room` URL parameter. When a client connects, the server will subscribe the socket to the desired room ID, or generate a new ID if one wasn't supplied, making connecting to a room as easy as sharing a URL

The server maintains a dedicated canvas for each room, and is responsible for updating the clients with the state of connected users, canvas updates, and cursor positions

## Commit-Based Drawing System

The commit-based drawing system is a novel approach to synchronizing drawing operations across multiple clients. It ensures consistency while optimizing performance and minimizing data transmission.

### System Overview

- **Master / Staging Buffers**  
  All local drawing is done on a "staging" buffer which is maintained separately from "Master" which is the known server state of the canvas.

- **Dirty Bounds Tracking:**  
  A "dirty rect" is tracked from only the affected area of the staging buffer, reducing unnecessary data transmission.

- **Commit Buffers**  
  Once the Dirty Rect becomes too large, or enough time has elapsed, the dirty-rect of the staging buffer is assigned a nonce, sent to the server, and pushed to the local commit stack.

- **Optimistic Compositing**  
  The Staging and Commit buffers are then composited with the Master buffer to represent an client-optimistic state of the canvas

- **Commit Resolution**  
  The server processes commits in the order they are recieved, and then retransmits them to all connected clients in the room.

  Clients apply the pulled commits, checking if they match the ClientID and Nonce of a local commit. If matched, only then is the local commit resolved and removed from the Commit Buffers.

```ts
pull = ({ id, buffer, dirtyRect }) => {
  const clientId = id.substring(0, 20);
  const commitId = id.substring(21);
  const img = new Image();
  img.src = buffer;

  img.onload = () => {
    // draw the image onto the master buffer
    const masterCtx = this.buffer.master.ctx;
    masterCtx.drawImage(
      img,
      dirtyRect.x,
      dirtyRect.y,
      dirtyRect.width,
      dirtyRect.height
    );

    // if the commit is from the current client, resolve it
    // we do this here to avoid flashes while the image is loading
    if (clientId == this.clientId) {
      this.resolve(parseInt(commitId));
    }

    this.compositeBuffers();
  };
};
```

This system ensures a responsive user experience, and allows for tuning the network performance characteristics with parameters such as the Maximum dirty-rect size or Minumum elapsed time.

## Canvas Navigation

Navigating a large canvas can be challenging, so I implemented smooth zooming and panning mechanics to make it intuitive and responsive. The navigation system uses linear interpolation (`lerp`) and real-time position tracking to ensure fluid transitions.

### **Zooming with Precision**

Zooming is handled dynamically based on user input, with constraints to prevent excessive zoom in or out. I also implemented a scaling adjustment that keeps the focus centered on the user's cursor during zoom operations.

```typescript
const handleWheel = (e: WheelEvent) => {
  if (isDragging.current) return;
  e.preventDefault();
  let newScale = e.deltaY > 0 ? position.current.z / 2 : position.current.z * 2;
  if (newScale < MIN_ZOOM) newScale = MIN_ZOOM;
  if (newScale > MAX_ZOOM) newScale = MAX_ZOOM;

  const scaleDiff = newScale - position.current.z;

  const dx =
    (e.clientX - position.current.x) * (scaleDiff / position.current.z);
  const dy =
    (e.clientY - position.current.y) * (scaleDiff / position.current.z);

  position.current = {
    x: Math.floor(position.current.x - dx),
    y: Math.floor(position.current.y - dy),
    z: newScale,
  };
};
```

### **Real-Time Interpolation**

To ensure smooth transitions during panning and zooming, I used a periodic animation loop to interpolate the position and zoom level. This creates a polished and responsive user experience.

```typescript
const interval = setInterval(() => {
  rtPosition.current = lerpVecN(
    rtPosition.current,
    { x: position.current.x, y: position.current.y, z: position.current.z },
    0.25
  );

  const distance = Math.sqrt(
    (rtPosition.current.x - position.current.x) ** 2 +
      (rtPosition.current.y - position.current.y) ** 2
  );

  if (distance < 1) {
    setIsZooming(false);
  }

  onUpdate?.(rtPosition.current);
}, 16);
```

### **useDraggable Hook**

This was then wrapped into a tidy useDraggable hook which could be easily consumed by the app. The supplied callback is called on Tick to smoothly update the transforms of the canvas without triggering a re-render.

```tsx
// let the canvas be draggable
// callback updates on tick (unmanaged by react for smooth zooming)
const { setPosition, isZooming } = useDraggable(
  useCallback(
    ({ x, y, z }: { x: number; y: number; z: number }) => {
      if (!canvas.current) return;
      canvas.current.style.transform = `translate(${x}px, ${y}px) scale(${z})`;
      cursorContainer.current!.style.left = `${x}px`;
      cursorContainer.current!.style.top = `${y}px`;
      cursorContainer.current!.style.setProperty("--scale", z.toString());
    },
    [canvas]
  )
);
```

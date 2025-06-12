---
layout: ../../layouts/PostLayout.astro
thumbnail: /gallery/auravale_campfire_thumbnail.jpg
title: "Auravale Character Art"
categories: [3D, personal]
---

![Auravale Campfire](/splash/auravale.jpg)

# Auravale Character Art

Auravale's characters had a lot of requirements; they needed to be playful, highly customizable, and fit with our cozy 2.5D environment art style.

Before modeling in 3D, I iterated heavily through concepting to find the right proportions and style. I rendered the same two character designs, a boy and a girl, in a variety of proportions and styles before landing on the final below.

![Auravale Campfire](/gallery/auravale_character_concept.jpg)

It was important that they shared the same skeleton proportions to leverage animations cross-genders, but even better if they shared the same body silhouette as well which would greatly simplify the cosmetic pipeline and avoid gender-locked clothing or blendshape pipline complexities.

To ensure this would work, I concepted a variety of clothing, both male and female, on the same silhouette and was quite happy with the results. The style was abstract enough to represent both genders (or anything in between) without it feeling forced or awkward allowing for much more player expression and a much simpler pipeline.

![Auravale Campfire](/gallery/auravale_character_concept_2.png)

# 3D Modeling

After landing on a final concept, I modeled the characters in 3D to test how they'd feel from the perspective of the game camera. Being a fairly zoomed isometric game, I wanted all the details of the character to be large and instantly readable. I kept iterating on making things chunkier than I had expected until it felt right

<video preload="metadata" autoplay loop>
  <source src="/gallery/auravale_character_walktest.mp4" type="video/mp4">
</video>

# Facial Features

One critical aspect of our character pipeline is our 2D facial features which are composited onto the character's head mesh with a custom shader. This shader is responsible for transforming the UVs of the head to move the part in the desired position, rotation, and scale. This was used not only for character customization, but for animating expressions as well.

<video preload="metadata" autoplay loop>
  <source src="/gallery/auravale_character_expressions.mp4" type="video/mp4">
</video>

# Animation System

Auravale also featured rich emotional simulations for the characters, and a deep animation system to express them. Characters could be in a variety of "emotion states" which would alter their core animations including how they walked, talked, and idled.

Rigging by Robert Willcock with animation by Russ Cahalan.

<video preload="metadata" controls autoplay loop>
  <source src="/gallery/auravale_character_emotion_states.mp4" type="video/mp4">
</video>

# Cosmetics System

Clothing items were modeled out separately and skinned to the same rig. At runtime we had a script that would copy the "master pose" of the body to all the wearable cosmetic items to keep them in sync.

This provided many benefits like better memory efficiency, special treatments for each cosmetic item's needs, and allowed us to scale our character team and work on multiple assets simultaneously.

![Auravale Campfire](/gallery/auravale_character_clothing.jpg)

# Character Pipeline Devlog

I covered our character pipeline in more detail in an incite devlog you can watch below.

<iframe style="aspect-ratio:16/9" src="https://www.youtube.com/embed/MhNamRc4qW8?si=eukKRKhVI95V-VQP" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

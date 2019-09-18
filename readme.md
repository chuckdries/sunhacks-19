prep branches contain code pre-written
prep/slides-with-code contains slides/notes with relevant code cherry-picked inline, but any given commit only touches code or notes but not both. Finalize code samples as notes are written
use interactive rebase to separate - slides go into master, code samples go into example/ branches

# Sunhacks 2019 "zero to hero" workshop series

A head-first introduction to web development

## Overview

This series will be broken into two workshops:

1. A web application that takes input from users and shows it to other users
2. Add user accounts and authentication to the application created in workshop 1

We're going to be building a message board, sort of like twitter but without the concept of "followers".

## How to use this repo

I'm writing the code for this in advance - all my original prep code and draft notes are in branches labeled `prep/...`.

the code we write together will eventually be uploaded to branches listed as `live/...`

The slides will live in the `slides` folder. When relevant, a slide may list a reference to an example branch, 
which will contain the project with that step completed. Try to finish a slide yourself first, but feel free to check out the example branch. 

Be sure you're writing your code in a separate branch so checking out example branches doesn't blow away your work!

TODO: do I want to move the prep branches to all be on top of the completed slides so checking out any given prep branch leaves you with all the slides intact?

sub-note: perhaps the prep branches actually do contain slides and code together,but only commit one or the other per commit. IR separate the commits into independent 'slides' and 'examples' branches, merge 'slides' into master, rebase 'examples' on top of master and then ref all the specific examples

# Sunhacks 2019 "zero to hero" workshop series

A head-first introduction to web development

## Overview

This series will be broken into two workshops:

1. A web application that takes input from users and shows it to other users
2. Add user accounts and authentication to the application created in workshop 1

We're going to be building a message board, sort of like twitter but without the concept of "followers".

## How to use this repo

I'm writing the code for this in advance - all my original prep code is in branches labeled `prep/...`.

the code we write together will eventually be uploaded to branches listed as `live/...`

The slides will live in the `slides` folder. When relevant, a slide may list a reference to a prep branch, which will contain the project with that step completed

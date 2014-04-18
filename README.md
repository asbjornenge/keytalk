# keytalk

A super simple messaging service for [keybase](http://keybase.io).

It's a pretty basic pre-alpha weekend project for now. It's just wrapping the keybase cli and pushing to [firebase](https://www.firebase.com/). 
Expect bugs.

Make sure you have the keybase cli installed and everything set up correctly before you start using this.

## Install

    npm install -g keytalk

## Usage

	keytalk <username> -m 'some message'  # sends a message to another user
	keytalk list                          # displays your list of messages
	keytalk read <id>                     # reads message with id

enjoy.
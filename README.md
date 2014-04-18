# keytalk

A super simple messaging service for [keybase](http://keybase.io).

It's a pretty basic pre-alpha weekend project for now. It's just wrapping the keybase cli and pushing to [firebase](https://www.firebase.com/). 
Expect bugs.

## Install

    npm install keytalk

## Usage

	keytalk <username> -m 'some message'  # sends a message to another user
	keytalk list                          # displays a list of messages
	keytalk read <id>                     # reads the 2 latest message

enjoy.
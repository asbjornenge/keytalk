# keytalk

A super simple messaging service for [keybase](http://keybase.io).

It's a pretty basic pre-alpha weekend project for now. It's just wrapping the keybase cli and pushing to [firebase](https://www.firebase.com/). 
Expect bugs.

Make sure you have the keybase cli installed and everything set up correctly before you start using this.

## Install

    npm install -g keytalk

## Usage

    keytalk -s                            # syncs messages with server
	keytalk -m 'some message' <username>  # sends a message to another user
	keytalk -l                            # displays your list of messages
	keytalk -r <num>                      # reads message number

## Changelog

### 0.1.0

* Changed the options relying more on optimist.
* Introduces cache and -s to sync with server.
* Both list (-l) and read (-r) will now use the cache.

### 0.0.2

Lots of bugfixes and minor changes.

### 0.0.1

Initial realeas. YAY!

## TODO

* Use keybase API instead of wrapping CLI

## IDEAS

* keybase chat
	* creates a firebase /chat/\<id\> "room"
	* Sets up a child_added listener and keeps decrypting every message

enjoy.
# keytalk

A super simple messaging service for [keybase](http://keybase.io).

It's your basic weekend project for now, wrapping the keybase cli and pushing to [firebase](https://www.firebase.com/). 
Expect bugs.

Make sure you have the keybase cli installed and everything set up correctly before you start using keytalk.

**!!!! Communication metadata is NOT encrypted, for now. !!!!**

## Install

    npm install -g keytalk

## Usage

    keytalk -s                            # syncs messages with server
	keytalk -m 'some message' <username>  # sends a message to another user
	keytalk -l                            # displays your list of messages
	keytalk -r <num>                      # reads message number

## Changelog

### 0.2.0

Support for interaction with the keybase cli. Big thanks to [@megatrond](https://github.com/megatrond) for that!

### 0.1.(1-2-3-4)

Minor formatting of output updates.

### 0.1.0

* Changed the options relying more on optimist.
* Introduces cache and -s to sync with server.
* Both list (-l) and read (-r) will now use the cache.

### 0.0.2

Lots of bugfixes and minor changes.

### 0.0.1

Initial realeas. YAY!

## TODO

* Tab complete users
* Use keybase API instead of wrapping CLI

## IDEAS

* keybase chat
	* creates a firebase /chat/\<id\> "room"
	* Sets up a child_added listener and keeps decrypting every message

enjoy.
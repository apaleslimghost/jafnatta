src-files = $(shell find src -name *.js)
lib-files = $(patsubst src/%.js, lib/%.js, $(src-files))

run: all
	node lib/test.js

all: $(lib-files)

lib/%.js: lib/index.js
	@:

lib/index.js: $(src-files) | tmp/src
	node_modules/.bin/babel --out-dir tmp $?
	touch $@

tmp/src: tmp lib
	ln -sf ../lib tmp/src

tmp lib:
	mkdir -p $@

clean:
	rm -rf lib tmp

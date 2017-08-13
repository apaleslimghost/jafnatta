src-files = $(shell find src -name *.js)
lib-files = $(patsubst src/%.js, lib/%.js, $(src-files))

run: $(lib-files)
	node lib/test.js

lib/%.js: src/%.js lib
	node_modules/.bin/babel $< -o $@

lib:
	mkdir -p $@

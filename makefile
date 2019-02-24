src-files = $(shell find src -name *.js)
lib-files = $(patsubst src/%.js, lib/%.js, $(src-files))

run: all
	node lib/test.js

all: $(lib-files)

lib/%.js: src/%.js
	mkdir -p $(@D)
	npx babel -o $@ $<

clean:
	rm -rf lib

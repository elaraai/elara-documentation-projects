help:
	@echo "Usage examples:"
	@echo ""
	@echo "    make build"
	@echo "    make help"

.PHONY: build
build: build-data_essentials 

.PHONY: clean
clean: 
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
	find . -name 'dist' -type d -prune -exec rm -rf '{}' +
	find . -name 'gen' -type d -prune -exec rm -rf '{}' +
	find . -name 'template.json' -prune -exec rm -rf '{}' +

.PHONY: build-data_essentials
build-data_essentials: 
	cd data_essentials && make build

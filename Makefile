help:
	@echo "Usage examples:"
	@echo ""
	@echo "    make build"
	@echo "    make help"

.PHONY: build
build: build-00_platform_essentials 

.PHONY: clean
clean: 
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
	find . -name 'dist' -type d -prune -exec rm -rf '{}' +
	find . -name 'gen' -type d -prune -exec rm -rf '{}' +
	find . -name 'template.json' -prune -exec rm -rf '{}' +

.PHONY: build-00_platform_essentials
build-00_platform_essentials: 
	cd 00_platform_essentials && make build

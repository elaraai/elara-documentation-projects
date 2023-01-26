help:
	@echo "Usage examples:"
	@echo ""
	@echo "    make build"
	@echo "    make help"

.PHONY: build
build: build-scripts build-how-tos build-data_essentials build-modelling_essentials 

.PHONY: clean
clean: 
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
	find . -name 'dist' -type d -prune -exec rm -rf '{}' +
	find . -name 'gen' -type d -prune -exec rm -rf '{}' +
	find . -name 'template.json' -prune -exec rm -rf '{}' +

.PHONY: build-data_essentials
build-data_essentials: 
	cd data_essentials && make build

.PHONY: build-modelling_essentials
build-modelling_essentials: 
	cd modelling_essentials && make build

.PHONY: build-how-tos
build-how-tos: 
	cd how-tos && make build

.PHONY: build-scripts
build-scripts: 
	cd scripts && make build

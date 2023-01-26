help:
	@echo "Usage examples:"
	@echo ""
	@echo "    make build"
	@echo "    make help"

.PHONY: build
build: build-generate_data_for_modelling_essentials

.PHONY: build-generate_data_for_modelling_essentials
build-generate_data_for_modelling_essentials: 
	cd generate_data_for_modelling_essentials && npm install && edk template build

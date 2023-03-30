help:
	@echo "Usage examples:"
	@echo ""
	@echo "    make build"
	@echo "    make help"

.PHONY: build
build: build-01_work_with_digital_twins build-02_create_descriptive_insights build-03_create_predictive_insights build-04_create_prescriptive_insights build-05_embed_business_improvement

.PHONY: build-01_work_with_digital_twins
build-01_work_with_digital_twins: 
	cd 01_work_with_digital_twins && make build

.PHONY: build-02_create_descriptive_insights
build-02_create_descriptive_insights:
	cd 02_create_descriptive_insights && make build

.PHONY: build-03_create_predictive_insights
build-03_create_predictive_insights: 
	cd 03_create_predictive_insights && make build

.PHONY: build-04_create_prescriptive_insights
build-04_create_prescriptive_insights: 
	cd 04_create_prescriptive_insights && make build

.PHONY: build-05_embed_business_improvement
build-05_embed_business_improvement: 
	cd 05_embed_business_improvement && make build

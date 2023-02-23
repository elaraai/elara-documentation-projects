help:
	@echo "Usage examples:"
	@echo ""
	@echo "    make build"
	@echo "    make help"

.PHONY: build
build: build-01_define_a_predictive_scenario build-03_train_an_ml_model build-04_predict_with_an_ml_model build-05_generate_predictive_insights build-06_analyse_scenarios_interactively

.PHONY: build-01_define_a_predictive_scenario
build-01_define_a_predictive_scenario: 
	cd 01_define_a_predictive_scenario && make build

.PHONY: build-03_train_an_ml_model
build-03_train_an_ml_model: 
	cd 03_train_an_ml_model && make build

.PHONY: build-04_predict_with_an_ml_model
build-04_predict_with_an_ml_model: 
	cd 04_predict_with_an_ml_model && make build

.PHONY: build-05_generate_predictive_insights
build-05_generate_predictive_insights: 
	cd 05_generate_predictive_insights && make build

.PHONY: build-06_analyse_scenarios_interactively
build-06_analyse_scenarios_interactively: 
	cd 06_analyse_scenarios_interactively && make build

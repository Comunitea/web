/** @odoo-module **/
import { evaluateExpr } from "@web/core/py_js/py";

const {Component} = owl;


export class FilterButton extends Component {
    setup() {
        this.model = this.env.searchModel;
        this.evaluator = evaluateExpr
    }
    /**
     * Filter flagged filters to be shown in the control panel.
     *
     * @param {Array} filters
     * @returns {Array}
     */
    shownFilters(filters) {
        const filterValues = Object.values(filters);
        // let res = filterValues.filter((filter) => {
        //     // return filter.context && filter.context.shown_in_panel;
        //     debugger;
        //     return filter.context && filter.context.includes("'shown_in_panel'");
        // });
        const res = []
        for (let i = 0; i < filterValues.length; i++) {
            let filter = filterValues[i];
            // Determine if context is a string or an object
            const context = filter.context;
            if ((typeof context) === 'string') {
                // context = this.evaluator(context);
                if (filter.context && filter.context.includes("'shown_in_panel'")) {
                    const newContext = this.evaluator(filter.context);
                    filter.context = newContext;
                    res.push(filter);
                }
            }
            if (context && context.shown_in_panel) {
                res.push(filter);
            }
        }
        return res

    }
    /**
     * Return custom properties depending on the filter properties
     *
     * @param {Object} filter
     * @returns {Object}
     */
    mapFilterType(filter) {
        const mapping = {
            filter: {
                color: "primary",
            },
            favorite: {
                color: "warning",
            },
            groupBy: {
                color: "info",
            },
        };
        return mapping[filter.type];
    }
    /**
     * Clear filters
     */
    onClickReset() {
        this.model.clearQuery();

    }
    /**
     * Set / unset filter
     * @param {Object} filter
     */
    onToggleFilter(filter) {
        this.model.toggleSearchItem(filter.id);
    }
}
FilterButton.template = "filter_button.FilterButton";

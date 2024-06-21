/** @odoo-module **/
import { evaluateExpr } from "@web/core/py_js/py";

const {Component} = owl;


export class FilterButton extends Component {
    setup() {
        this.model = this.env.searchModel;
    }
    /**
     * Filter flagged filters to be shown in the control panel.
     *
     * @param {Array} filters
     * @returns {Array}
     */
    shownFilters(filters) {
        // Ensure context is always an object to prevent template errors.
        // Convert context from string to object if necessary.
        return filters.filter((filter) => {
            if (typeof filter.context === 'string') {
                filter.context = evaluateExpr(filter.context);
            }
            return filter.context && filter.context.shown_in_panel;
        });
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

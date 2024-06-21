/** @odoo-module **/
import { evaluateExpr } from "@web/core/py_js/py";

const {Component} = owl;


export class FilterButton extends Component {
    setup() {
        this.model = this.env.searchModel;
        this.evaluateExpr = evaluateExpr
    }
    /**
     * Filter flagged filters to be shown in the control panel.
     *
     * @param {Array} filters
     * @returns {Array}
     */
    shownFilters(filters) {
        return filters.filter((filter) => {
            // Sometimes the context is a string, sometimes it's an object.
            // When the filter is a favorite, the context is an object
            if (typeof filter.context === 'string') {
                return evaluateExpr(filter.context).shown_in_panel;
            } else if (typeof filter.context === 'object') {
                return filter.context.shown_in_panel;
            }
            return false;
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

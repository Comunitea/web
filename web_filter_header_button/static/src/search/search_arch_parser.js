/** @odoo-module **/
import { SearchArchParser } from "@web/search/search_arch_parser";
import {patch} from "web.utils";

/**
 * Returns the split 'group_by' key from the given context attribute.
 * This helper accepts any invalid context or one that does not have
 * a valid 'group_by' key, and falls back to an empty list.
 * @param {string} context
 * @returns {string[]}
 */
function getContextGroubBy(context) {
    try {
        return makeContext([context]).group_by.split(":");
    } catch (_err) {
        return [];
    }
}

function reduceType(type) {
    if (type === "dateFilter") {
        return "filter";
    }
    if (type === "dateGroupBy") {
        return "groupBy";
    }
    return type;
}

function reduceType(type) {
    if (type === "dateFilter") {
        return "filter";
    }
    if (type === "dateGroupBy") {
        return "groupBy";
    }
    return type;
}


// Need to patch the SearchArchParser to include the context when parsing
// filters of type groupBy.
// This is a ugly solution, we only add preSearchItem.context = context;
patch(SearchArchParser.prototype, "filter_header_button.SearchArchParser", {
    visitFilter(node) {
        debugger;
        const preSearchItem = { type: "filter" };
        if (node.hasAttribute("context")) {
            const context = node.getAttribute("context");
            const [fieldName, defaultInterval] = getContextGroubBy(context);
            const groupByField = this.fields[fieldName];
            if (groupByField) {
                preSearchItem.type = "groupBy";
                preSearchItem.fieldName = fieldName;
                preSearchItem.fieldType = groupByField.type;
                if (["date", "datetime"].includes(groupByField.type)) {
                    preSearchItem.type = "dateGroupBy";
                    preSearchItem.defaultIntervalId = defaultInterval || DEFAULT_INTERVAL;
                }
                // ! Important: We need to store the context in the preSearchItem
                preSearchItem.context = context;
            } else {
                preSearchItem.context = context;
            }
        }
        if (reduceType(preSearchItem.type) !== this.currentTag) {
            this.pushGroup(reduceType(preSearchItem.type));
        }
        if (preSearchItem.type === "filter") {
            if (node.hasAttribute("date")) {
                const fieldName = node.getAttribute("date");
                preSearchItem.type = "dateFilter";
                preSearchItem.fieldName = fieldName;
                preSearchItem.fieldType = this.fields[fieldName].type;
                preSearchItem.defaultGeneratorIds = [DEFAULT_PERIOD];
                if (node.hasAttribute("default_period")) {
                    preSearchItem.defaultGeneratorIds = node
                        .getAttribute("default_period")
                        .split(",");
                }
            } else {
                let stringRepr = "[]";
                if (node.hasAttribute("domain")) {
                    stringRepr = node.getAttribute("domain");
                }
                preSearchItem.domain = stringRepr;
            }
        }
        const modifiers = JSON.parse(node.getAttribute("modifiers") || "{}");
        if (modifiers.invisible === true) {
            preSearchItem.invisible = true;
            const fieldName = preSearchItem.fieldName;
            if (fieldName && !this.fields[fieldName]) {
                // In some case when a field is limited to specific groups
                // on the model, we need to ensure to discard related filter
                // as it may still be present in the view (in 'invisible' state)
                return;
            }
        }
        preSearchItem.groupNumber = this.groupNumber;
        if (node.hasAttribute("name")) {
            const name = node.getAttribute("name");
            preSearchItem.name = name;
            if (name in this.searchDefaults) {
                preSearchItem.isDefault = true;
                if (["groupBy", "dateGroupBy"].includes(preSearchItem.type)) {
                    const value = this.searchDefaults[name];
                    preSearchItem.defaultRank = typeof value === "number" ? value : 100;
                } else {
                    preSearchItem.defaultRank = -5;
                }
            }
        }
        if (node.hasAttribute("string")) {
            preSearchItem.description = node.getAttribute("string");
        } else if (preSearchItem.fieldName) {
            preSearchItem.description = this.fields[preSearchItem.fieldName].string;
        } else if (node.hasAttribute("help")) {
            preSearchItem.description = node.getAttribute("help");
        } else if (node.hasAttribute("name")) {
            preSearchItem.description = node.getAttribute("name");
        } else {
            preSearchItem.description = "Ω";
        }
        this.currentGroup.push(preSearchItem);
    }
});
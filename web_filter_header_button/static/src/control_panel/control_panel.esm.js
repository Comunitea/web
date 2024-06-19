/** @odoo-module **/
import {FilterButton} from "../filter_button/filter_button.esm";
import {FilterButtonLegacy} from "../filter_button/filter_button_legacy.esm";
import LegacyControlPanel from "web.ControlPanel";
import {ControlPanel} from "@web/search/control_panel/control_panel";
import {patch} from "web.utils";

patch(LegacyControlPanel, "filter_button.LegacyControlPanel", {
    components: {
        ...LegacyControlPanel.components,
        FilterButtonLegacy,
    },
});

patch(ControlPanel, "filter_button.ControlPanel", {
    components: {
        ...ControlPanel.components,
        FilterButton,
    },
});
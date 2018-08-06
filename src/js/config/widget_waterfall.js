

import ConfigWidgetBase from './widget_base';
import z from '../core/lib';

let ConfigWidgetWaterfall = z.extend({}, ConfigWidgetBase, {
    waterfall: {
        showLoadMore:true,
        continuousScroll:false,
        gridWidth:300,
        animate:true,
        animateSpeed:400,
        handleResize:true,
        templateFeed:'waterfall-feed'
    }
});

export default ConfigWidgetWaterfall;
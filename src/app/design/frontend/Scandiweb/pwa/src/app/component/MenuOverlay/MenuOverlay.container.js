import { connect } from 'react-redux';

import { mapDispatchToProps } from 'SourceComponent/MenuOverlay/MenuOverlay.container';

import MenuOverlay from './MenuOverlay.component';

export const mapStateToProps = state => ({
    womenMenu: state.HeaderAndFooterReducer.womenMenu,
    menMenu: state.HeaderAndFooterReducer.menMenu,
    moreInfoMenu: state.HeaderAndFooterReducer.moreInfoMenu,
    blocks: state.CmsBlocksAndSliderReducer.blocks
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuOverlay);

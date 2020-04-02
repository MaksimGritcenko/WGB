import { Slider as SourceSliderQuery } from 'SourceQuery/Slider.query';

export class Slider extends SourceSliderQuery {
    _getSlideFields() {
        return [
            'slide_text',
            'slide_id',
            'mobile_image',
            'desktop_image',
            'title',
            'is_active',
            'slide_content_is_white'
        ];
    }
}

export default new Slider();

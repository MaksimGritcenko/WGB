import FieldSource from 'SourceComponent/Field/Field.component';
import './Field.style';

export default class Field extends FieldSource {

    renderTextarea() {
        const {
            id,
            name,
            rows,
            formRef,
            isDisabled,
            placeholder
        } = this.props;

        const { value } = this.state;

        return (
            <textarea
              ref={ formRef }
              id={ id }
              name={ name }
              rows={ rows }
              value={ value }
              placeholder={ placeholder }
              disabled={ isDisabled }
              onChange={ this.onChange }
              onFocus={ this.onFocus }
              onClick={ this.onClick }
            />
        );
    }
}

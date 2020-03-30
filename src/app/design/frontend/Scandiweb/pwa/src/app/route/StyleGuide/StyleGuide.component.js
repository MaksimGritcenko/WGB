import { PureComponent } from 'react';
import Field from 'SourceComponent/Field';
import './StyleGuide.style';

export class StyleGuide extends PureComponent {
    renderButtons() {
        return (<>
        <div className="ButtonRow">
            <a block="Button">Small</a>
            <a block="Button" mix={ { block: "Button", mods: { isHollow: true } } } >Small Hollow</a>
        </div>

        <div className="ButtonRow">
            <a block="Button" mix={ { block: "Button", elem: "Big" } }>Big</a>
            <a block="Button" elem="Big" mix={ { block: "Button", mods: { isHollow: true } } } >Big Hollow</a>
        </div>
        </>);
    }

    renderForm() {
        return (<>
              <Field
                type="checkbox"
                label={ __('Create free account and keep track of your orders') }
                id="guest_create_user"
                name="guest_create_user"
                value={ true }
                skipValue
                onChange={ () => {} }
              />
              <Field
                type="text"
                label={ __('Create free account and keep track of your orders') }
                id="guest_create_user"
                name="guest_create_user"
                value={ "Amazing" }
                skipValue
                onChange={ () => {} }
              />
        </>);
    }

    renderSubheadings() {
        return (<>
            <h1 block="Subheading">This is Heading level 1</h1>
            <h2 block="Subheading">This is Heading level 2</h2>
            <h3 block="Subheading">This is Heading level 3</h3>
            <h4 block="Subheading">This is Heading level 4</h4>
        </>);
    }

    renderHeadings() {
        return (<>
            <h1>This is Heading level 1</h1>
            <h2>This is Heading level 2</h2>
            <h3>This is Heading level 3</h3>
            <h4>This is Heading level 4</h4>
        </>);
    }

    renderText() {
        return (<>
            <p>We use first- and third-party cookies to improve your browsing</p>
            <p block="Big">We use first- and third-party cookies to improve your browsing</p>
            <p block="Subtext">We use first- and third-party cookies to improve your browsing</p>
            <p block="Smalltext">We use first- and third-party cookies to improve your browsing</p>
        </>);
    }

    render() {
        return (
            <div block="StyleGuide">
                <h1>Style Guide for WGB</h1>
                <hr />
                { this.renderHeadings() }
                { this.renderSubheadings() }
                { this.renderForm() }
                { this.renderButtons() }
                { this.renderText() }
            </div>
        );
    }
}

export default StyleGuide;

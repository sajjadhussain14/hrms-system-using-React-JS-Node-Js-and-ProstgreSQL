import React from "react";
import ReactDOM from "react-dom";
import ContentEditable from "react-contenteditable";
import EditableLabel from "react-inline-editing";
//import EasyEdit from "react-easy-edit";


class EditableInput extends React.Component {
    
  constructor(props) {
    super();
    this.contentEditable = React.createRef();
    this.state = { html: "Input your text" };
    this.text = props.text ? props.text : props.type == "number"? "0.00" :"Input your text";
    this.name = props.name != undefined ? props.name : 'inputText' ;
    this.type = props.type != undefined ? props.type : 'text' ;
    this.maxlength = props.maxlength != undefined ? props.maxlength : 50;
    this.height = props.height != undefined ? props.height : "20px";
    this.width = props.width != undefined ? props.width : "100%";           
  }

  handleChange = (evt) => {
    this.setState({ html: evt.target.value });
    this.props.onChange({ key: evt.target.value})
  };

  handleChangeInput = (val) => {
    this.setState({ html: val });
    this.props.handleChangeEditableInput({ key:this.name , value: val !="Input your text" ? val : "" })
  };

  save = (value) => {
    alert(value);
  };

  cancel = () => {
    alert("Cancelled");
  };

  handleBlur = () => {
    console.log(this.state.html);
  };

  handleEnterKey = (e) => {
    console.log(e)
    //e.preventDefault();
  };


  render = () => {
    if(this.type == "textarea") {
      return(
        <ContentEditable
          innerRef={this.contentEditable}
          html={this.state.html} // innerHTML of the editable div
          disabled={false} // use true to disable editing
          onChange={this.handleChange} // handle innerHTML change
          tagName="article" // Use a custom HTML tag (uses a div by default)
          onBlur={this.handleBlur}
        />
      )   
    } else {
      return(
        <EditableLabel
          text={this.text}
          labelClassName="editableInputLabelClass"
          inputClassName="myInputClass py-2"
          inputName="myaaabbbb"
          inputId="myaaabbbb"
          inputWidth={this.width}
          inputHeight={this.height}
          inputMaxLength={this.maxlength}
          onFocusOut={this.handleChangeInput}
          // labelFontWeight="bold"
          // inputFontWeight="bold"
          // onFocus={this._handleFocus}
          // onFocusOut={this._handleFocusOut}
        />

        
      );
    }
      
    

    
    /*return (
      <div>        
        <div style={{ marginTop: "10px" }}>
          <b>
            <u>react-contenteditable:-</u>
          </b>
          <div style={{ margin: "10px 10px" }}>
            <ContentEditable
              innerRef={this.contentEditable}
              html={this.state.html} // innerHTML of the editable div
              disabled={false} // use true to disable editing
              onChange={this.handleChange} // handle innerHTML change
              tagName="article" // Use a custom HTML tag (uses a div by default)
              onBlur={this.handleBlur}
            />
          </div>
        </div>
        <div>
          <div style={{ width: "100%", border: "1px solid" }}></div>
          <div style={{ marginTop: "10px" }}>
            <b>
              <u>react-inline-editing:-</u>
            </b>
            <div style={{ margin: "10px 10px" }}>
              <EditableLabel
                text="Hello World"
                labelClassName="myLabelClass"
                inputClassName="myInputClass"
                inputWidth="200px"
                inputHeight="25px"
                inputMaxLength="50"
                // labelFontWeight="bold"
                // inputFontWeight="bold"
                // onFocus={this._handleFocus}
                // onFocusOut={this._handleFocusOut}
              />
            </div>
          </div>
        </div>
        <div>
          <div style={{ width: "100%", border: "1px solid" }}></div>
          <div style={{ marginTop: "10px" }}>
            <b>
              <u>react-easy-edit:-</u>
            </b>
            <div style={{ margin: "10px 10px" }}>
              <EasyEdit
                type="text"
                onSave={this.save}
                disable={true}
                onCancel={this.cancel}
                saveButtonLabel="Save Me"
                cancelButtonLabel="Cancel Me"
                attributes={{ name: "awesome-input", id: 1 }}
                instructions="Editing..."
                onValidate={(value) => {
                  return value != null && value?.trim().length !== 0;
                }}
              />
            </div>
          </div>
        </div>

        
      </div>
    );*/
  };
}

export default EditableInput
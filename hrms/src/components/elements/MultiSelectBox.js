import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export default function MultiSelectBox(props) {
  
  return (
      <Select
        closeMenuOnSelect={false}
        components={animatedComponents}
        defaultValue={props.selectOptionsDefault && props.selectOptionsDefault.length ? props.selectOptionsDefault : []}
        isMulti
        options={props.options}
        onChange={event => props.setSelectedMultiItems(event)}
      />    
  );
}
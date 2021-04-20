import React from 'react';
import { withRouter } from 'react-router-dom';

import CustomButton from '../custom-button/custom-button.component';

import {
  MenuItemContainer,
  ContentContainer,
  ContentTitle,
  ButtonHolder
} from './menu-item-with-buttons.styles';

const MenuItemWithButtons = ({ title, onClick, onEditButtonClick, onDeleteButtonClick }) => {

  const handleEditButtonClick = e => {
    e.stopPropagation();
    onEditButtonClick();
  };

  const handleDeleteButtonClick = e => {
    e.stopPropagation();
    onDeleteButtonClick();
  }
  return (
    <MenuItemContainer
      onClick={onClick}
    >
      <ContentContainer>
        <ContentTitle>{ title }</ContentTitle>
      </ContentContainer>
      <ButtonHolder>
        <CustomButton onClick={handleEditButtonClick}> Edit </CustomButton>
        <CustomButton onClick={handleDeleteButtonClick}> Delete </CustomButton>
      </ButtonHolder>
    </MenuItemContainer>
  )
}

export default withRouter(MenuItemWithButtons);

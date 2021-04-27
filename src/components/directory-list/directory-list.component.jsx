import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeStyles } from '@material-ui/core/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { 
  selectDirectoryFilteredCategories, 
  selectDirectoryFilteredStatus, 
  selectDirectoryItems, 
  selectDirectoryIsTodoFiltered 
} from '../../redux/directory/directory.selectors';

import MenuItemWithButtons from '../menu-item-with-buttons/menu-item-with-buttons.component';
import ItemManagerItemMoreOptions from '../item-manager/item-manager-menu.component';

import { getStatusIcon } from '../directory/directory.helpers';
import { setItems } from '../../redux/directory/directory.actions';

const useStyles = makeStyles({
  iconMenuItem: {
    marginRight: '20px',
    width: '1.5rem',
  },
});

const DirectoryList = ({ handleClickOpenDetailPopup, handleClickOpenEditPopup, handleClickDeleteItem}) => {
  let filteredItemCount = 0;
  const { iconMenuItem } = useStyles();
  const dispatch = useDispatch();


  const {items, filteredCategories, isTodoFilter, filteredStatus} = useSelector(createStructuredSelector({
    items: selectDirectoryItems,
    filteredCategories: selectDirectoryFilteredCategories,
    isTodoFilter: selectDirectoryIsTodoFiltered,
    filteredStatus: selectDirectoryFilteredStatus
  }));

  const [draggableItems, setDraggableItems] = useState([]);

  useEffect(() => {
    setDraggableItems(items);
  }, [items]);

  function handleOnDragEnd(result) {
    let dragItems = draggableItems;
    const destinationIndex = dragItems[result.destination.index].index;
    const nextItemIndex = dragItems.length > result.destination.index + 1 ? dragItems[result.destination.index + 1].index : destinationIndex - 1000;
    const newItemIndex = (destinationIndex + nextItemIndex) / 2;
    dragItems[result.source.index].index = newItemIndex;
    const [reorderedItem] = dragItems.splice(result.source.index, 1);
    dragItems.splice(result.destination.index, 0, reorderedItem);
    dispatch(setItems(dragItems, result.draggableId, newItemIndex));
    setDraggableItems(dragItems);
  }
  
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="items">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            { 
              draggableItems.map((item, index) => {
                const { id, title, categories, isTodo, status, ...otherItemsProps } = item;
                const isCategoryFiltered = filteredCategories.length === 0 
                  || (categories 
                  && categories.some(categoryId=> filteredCategories.indexOf(categoryId) !== -1) );
                const statusIsFiltered = (filteredStatus.length === 0 
                  || filteredStatus.indexOf(status) !== -1
                  );
                const isTodoFiltered = statusIsFiltered 
                && ((isTodo && isTodoFilter) 
                || !isTodoFilter);
                const isFiltered = isCategoryFiltered && isTodoFiltered;
                const icon = isTodo && getStatusIcon(status, iconMenuItem);
                if (isFiltered) filteredItemCount++;
                return (
                  isFiltered &&
                  <Draggable  key={id}  draggableId={id} index={index}>
                    {(provided) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.draggableProps} 
                        {...provided.dragHandleProps}
                      >
                        <MenuItemWithButtons 
                          title={title.toUpperCase()}
                          onClick={() => handleClickOpenDetailPopup(item)}
                          onEditButtonClick={() => handleClickOpenEditPopup(item)}
                          onDeleteButtonClick={() => handleClickDeleteItem(id)}
                          Icon={icon}
                          Menu={ItemManagerItemMoreOptions}
                          {...otherItemsProps}
                        />
                      </div>
                    )}
                  </Draggable>
                )
              })
            }
            {
              filteredItemCount === 0 && 
              <div style={{height: '80px'}}> No categories with current filters </div>
            }
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DirectoryList;
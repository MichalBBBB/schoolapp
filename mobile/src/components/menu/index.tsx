import React from 'react';
import {BasicCard} from '../basicViews/BasicCard';

interface MenuProps {
  closeModal?: () => void;
}

export const Menu: React.FC<MenuProps> = ({closeModal, children}) => {
  return (
    <BasicCard
      backgroundColor="accentBackground"
      style={{
        elevation: 8,
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 20,
      }}>
      {Array.isArray(children)
        ? children.map((childrenItem, index) => {
            return React.cloneElement(childrenItem, {
              closeModal,
              key: index,
            });
          })
        : React.cloneElement(children as any, {
            closeModal,
          })}
    </BasicCard>
  );
};

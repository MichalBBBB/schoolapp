import React from 'react';
import {ColorsObject} from '../../types/Theme';
import {BasicCard} from '../basicViews/BasicCard';

interface MenuProps {
  closeModal?: () => void;
  backgroundColor?: keyof ColorsObject;
}

export const Menu: React.FC<MenuProps> = ({
  closeModal,
  children,
  backgroundColor = 'accentBackground2',
}) => {
  return (
    <BasicCard
      backgroundColor={backgroundColor}
      style={{
        elevation: 8,
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 20,
      }}>
      {Array.isArray(children)
        ? children.map((childrenItem, index) => {
            if (childrenItem) {
              return React.cloneElement(childrenItem, {
                closeModal,
                key: index,
              });
            }
          })
        : React.cloneElement(children as any, {
            closeModal,
          })}
    </BasicCard>
  );
};

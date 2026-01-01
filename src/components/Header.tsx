import React from 'react';
import { Appbar } from 'react-native-paper';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  actions?: Array<{
    icon: string;
    onPress: () => void;
  }>;
}

const Header: React.FC<HeaderProps> = ({ title, onBackPress, actions }) => {
  return (
    <Appbar.Header>
      {onBackPress && <Appbar.BackAction onPress={onBackPress} />}
      <Appbar.Content title={title} />
      {actions?.map((action, index) => (
        <Appbar.Action
          key={index}
          icon={action.icon}
          onPress={action.onPress}
        />
      ))}
    </Appbar.Header>
  );
};

export default Header;
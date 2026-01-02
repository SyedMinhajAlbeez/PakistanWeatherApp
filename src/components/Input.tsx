import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  left?: any;
  right?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  keyboardType = 'default',
  error = false,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  left,
  right,
}) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
      error={error}
      disabled={disabled}
      multiline={multiline}
      numberOfLines={numberOfLines}
      mode="outlined"
      style={styles.input}
      left={left}
      right={right}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
  },
});

type InputComponentType = React.FC<InputProps> & { Icon: typeof TextInput.Icon };
const InputComponent = Input as InputComponentType;
InputComponent.Icon = TextInput.Icon;

export default InputComponent;
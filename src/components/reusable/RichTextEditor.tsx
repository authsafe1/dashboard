import StarterKit from '@tiptap/starter-kit';
import {
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonEditLink,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRedo,
  MenuButtonRemoveFormatting,
  MenuButtonStrikethrough,
  MenuButtonUndo,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor as MuiRichTextEditor,
} from 'mui-tiptap';
import { FC } from 'react';

interface IRichTextEditorProps {
  value?: any;
  onUpdate?: (content: any) => void;
}

const RichTextEditor: FC<IRichTextEditorProps> = ({ value, onUpdate }) => {
  return (
    <MuiRichTextEditor
      extensions={[StarterKit]}
      content={value}
      onUpdate={({ editor }) => (onUpdate ? onUpdate(editor?.getJSON()) : null)}
      renderControls={() => (
        <MenuControlsContainer>
          <MenuSelectHeading />
          <MenuDivider />
          <MenuButtonBold />
          <MenuButtonItalic />
          <MenuButtonBlockquote />
          <MenuButtonStrikethrough />
          <MenuDivider />
          <MenuButtonBulletedList />
          <MenuButtonOrderedList />
          <MenuDivider />
          <MenuButtonEditLink />
          <MenuDivider />
          <MenuButtonUndo />
          <MenuButtonRedo />
          <MenuDivider />
          <MenuButtonRemoveFormatting />
        </MenuControlsContainer>
      )}
    />
  );
};

export default RichTextEditor;

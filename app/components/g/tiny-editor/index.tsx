'use client'
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

interface Props {
  value?: string;
  onChange?: (content: string) => void;
}

const TinyEditor: React.FC<Props> = ({ value, onChange }) => {
	const {theme} = useTheme();

	const tinySkin = useMemo(() => {
		if (theme == 'light') {
			return 'oxide'
		} else {
			return 'oxide-dark'
		}
	}, [theme])

  const handleEditorChange = (content: string) => {
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <Editor
			key={theme}
      apiKey='e8yv0tm9cfv0f52tpd8pe3zx821ombh28e903w35cs1u2p7y'
      init={{
				skin: tinySkin,
				content_css: `${theme}`,
        plugins: 'anchor autolink charmap emoticons link lists searchreplace visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
      }}
      value={value || ""} 
      onEditorChange={handleEditorChange}
    />
  );
};

export default TinyEditor;
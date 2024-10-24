'use client'
import React from 'react';
import DOMPurify from 'dompurify';

interface Props {
  htmlContent?: string;
}

const SanitizedHTML: React.FC<Props> = ({ htmlContent = '' }) => {
  const cleanHtml = DOMPurify.sanitize(htmlContent);

  return (
    <div
			className='sanitized-html'
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};

export default SanitizedHTML;
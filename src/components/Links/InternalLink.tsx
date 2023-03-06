import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

export const InternalLink: React.FC<LinkProps> = (props) => (
    <Link {...props} style={{ color: 'inherit', textDecoration: 'inherit', ...props.style }} />
);

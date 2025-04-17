import React from 'react';
import { Breadcrumbs, Typography, Link as MuiLink } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const BreadcrumbNav = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <Breadcrumbs sx={{ mb: 2 }}>
      <MuiLink component={Link} to="/">Home</MuiLink>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <Typography key={name}>{name}</Typography>
        ) : (
          <MuiLink component={Link} key={name} to={routeTo}>
            {name}
          </MuiLink>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbNav;

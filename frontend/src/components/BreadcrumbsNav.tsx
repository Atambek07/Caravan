import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export interface Crumb {
  label: string;
  to?: string;
}

export const BreadcrumbsNav = ({ items }: { items: Crumb[] }) => (
  <Breadcrumbs sx={{ mb: 2 }}>
    {items.map((item, idx) =>
      item.to && idx < items.length - 1 ? (
        <Link key={item.label} component={RouterLink} to={item.to} underline="hover" color="inherit">
          {item.label}
        </Link>
      ) : (
        <Typography key={item.label} color="text.primary">
          {item.label}
        </Typography>
      ),
    )}
  </Breadcrumbs>
);

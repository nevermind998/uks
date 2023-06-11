import { Divider, Link, List, ListItem } from '@mui/material';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import React from 'react';

const Forks = ({ forks }: any) => {
  return (
    <div>
      <h3 className="repository__heading">Forked Repositories</h3>
      <Divider light />
      <List className="repository__stargazers">
        {forks.length != 0 ? (
          forks.map((x: any) => (
            <>
              <ListItem className="repository__list-item" disablePadding>
                <FolderSpecialIcon color="action"></FolderSpecialIcon>
                <Link underline="hover" color="inherit" href={'/repository/' + x.id}>
                  {x.name}
                </Link>
              </ListItem>
              <Divider light />
            </>
          ))
        ) : (
          <p>No forked repositories still.</p>
        )}
      </List>
    </div>
  );
};

export default Forks;

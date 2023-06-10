import { Divider, List, ListItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React from 'react';

const Stargazers = ({ stargazers }: any) => {
  return (
    <div>
      <h3 className="repository__heading">Stargazers</h3>
      <Divider light />
      <List className="repository__stargazers">
        {stargazers.length != 0 ? (
          stargazers.map((x: any) => (
            <>
              <ListItem className="repository__list-item" disablePadding>
                <AccountCircleIcon color="action"></AccountCircleIcon>
                {x.username}
              </ListItem>
              <Divider light />
            </>
          ))
        ) : (
          <p>No stargezers still.</p>
        )}
      </List>
    </div>
  );
};

export default Stargazers;

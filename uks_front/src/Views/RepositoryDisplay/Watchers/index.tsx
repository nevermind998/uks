import { Divider, List, ListItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React from 'react';

const Watchers = ({ watchers }: any) => {
  return (
    <div>
      <h3 className="repository__heading">Watchers</h3>
      <Divider light />
      <List className="repository__stargazers">
        {watchers.length != 0 ? (
          watchers.map((x: any) => (
            <>
              <ListItem className="repository__list-item" disablePadding>
                <AccountCircleIcon></AccountCircleIcon>
                {x.username}
              </ListItem>
              <Divider light />
            </>
          ))
        ) : (
          <p>No watchers still.</p>
        )}
      </List>
    </div>
  );
};

export default Watchers;

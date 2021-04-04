import React, { useEffect, useState } from 'react';

import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';

import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 1100,
  },
});

function App() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([]);
  const [codes, setCodes] = useState([]);
  const [visited, setVisited] = useState([]);

  const getCodes = (parent = 1) => {
    return fetch(`/codes/?parent=${parent}`).then((data) => data.json());
  };

  useEffect(() => {
    getCodes().then((data) => {
      setCodes(data);
    });
  }, []);

  const handleCodeClick = (code, path) => {
    if (expanded.includes(String(code.id))) {
      setExpanded([...expanded.filter((i) => i !== String(code.id))]);
    } else {
      setExpanded([...expanded, String(code.id)]);
    }

    if (code.hasChild && !visited.includes(code.id)) {
      getCodes(code.id).then((data) => {
        const newTree = cloneDeep(codes);
        set(newTree, path, data);
        setCodes(newTree);
        setVisited([...visited, code.id]);
      });
    }
  };

  const renderTree = (code, path) => {
    return (
      <TreeItem
        key={code.id}
        nodeId={String(code.id)}
        onClick={() => handleCodeClick(code, path)}
        label={`${code.code} ${code.descriptionUA}`}
      >
        {code.children && code.children.map((code, arrayIndex) => renderTree(code, `${path}.${arrayIndex}.children`))}
      </TreeItem>
    );
  };

  return (
    <TreeView
      className={classes.root}
      expanded={expanded}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {codes.map((code, index) => renderTree(code, `${index}.children`))}
    </TreeView>
  );
}

export default App;

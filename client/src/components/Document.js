import React, { useMemo, useEffect, useState, useContext, useCallback } from 'react';
import { Typography, Grid, Divider, Fab, useTheme } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import Spinner from './Spinner';
import Center from './Center';
import useStorageValue from '../hooks/withStorageValue';
import Editor from './Editor';
import mainContext from '../context';

export default function Document({ match, path, id, view }) {
  const context = useContext(mainContext);
  const theme = useTheme();
  const [raw, setRaw] = useState();
  const [s, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debug] = useStorageValue('debug');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5100/api/messages`);
        const data = await res.json();
        const message = data.find(m => m.id === id || id === undefined);
        if (message) {
          setSnapshot({ exists: true, data: () => message });
          setRaw(JSON.stringify(message, null, 2));
        } else {
          setSnapshot({ exists: false });
        }
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const save = useCallback(async () => {
    try {
      const data = JSON.parse(raw);
      await fetch(`http://localhost:5100/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      console.log('Saved!');
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  }, [id, raw]);

  const Wrapper = useMemo(() => {
    return !context.depth && debug
      ? ({ rawData, children }) => (
          <Grid container direction="row" className="fill" style={{ position: 'relative' }}>
            <Grid item xs className="fill scroll" style={{ maxWidth: 400 }}>
              {children}
            </Grid>
            <Divider />
            <Grid item xs className="fill scroll">
              <Editor onChange={setRaw} value={rawData} />
              <Fab onClick={save} style={{
                position: 'absolute',
                bottom: theme.spacing(2),
                right: theme.spacing(2),
              }}>
                <SaveIcon />
              </Fab>
            </Grid>
          </Grid>
        )
      : ({ children }) => children;
  }, [context.depth, debug, save, theme]);

  return loading ? <Spinner />
    : error ? <Error message={`path=${path} error=${JSON.stringify(error)}`} />
    : s?.exists
      ? <mainContext.Provider value={{
          ...context,
          depth: ((context && context.depth) || 0) + 1
        }}>
        <Wrapper rawData={raw}>
          <div style={{ padding: '2rem' }}>
            <h2>Bark</h2>
            <p>{s.data().text}</p>
          </div>
        </Wrapper>
        </mainContext.Provider>
      : <Error status={404} />;
}

function Error({ status, message }) {
  return (
    <Center>
      <Grid container direction="column" alignItems="center">
        {status === 404
          ? <Typography variant="h1" color="textSecondary">404</Typography>
          : <>
              <Typography variant="h6">Sh*t!@#$</Typography>
              <Typography variant="body2">{message}</Typography>
            </>
        }
      </Grid>
    </Center>
  );
}

import React, {FormEvent} from 'react';
import {ButtonBase, Grid, InputBase, Link, styled, Typography} from "@mui/material";
import {useWeb3ApiClient} from "@web3api/react";
import {MetaData} from "../../util/MetaData";
import {polywrapPalette} from "../../theme";
import {Uri} from "@web3api/client-js";

const SectionContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('lg')]: {
    alignItems: "flex-start",
  },
}));

const UriForm = styled("form")(({ theme }) => ({
  margin: "0 auto",
  [theme.breakpoints.down('lg')]: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    flexDirection: "column",
  },
}));

const UriInput = styled(InputBase)(({ theme }) => ({
  font: "inherit",
  color: polywrapPalette.white,
  width: "400px",
  border: "3px solid #529dad",
  outline: "none",
  borderRadius: "4px",
  margin: "2.5rem 2rem 2.5rem 0",
  padding: "1rem",
  background: "none",
  boxSizing: "content-box",
  letterSpacing: "inherit",
  animationDuration: "10ms",
  "-webkit-tap-highlight-color": "transparent",
  [theme.breakpoints.down('lg')]: {
    margin: "1.5rem 0 1rem 0",
  },
}));

const FetchButton = styled(ButtonBase)(({ theme }) => ({
  background: `radial-gradient(circle at 80% 50%, ${polywrapPalette.tertiary[400]}, ${polywrapPalette.tertiary[500]})`,
  backgroundSize: '250%',
  backgroundPositionX: '0px',
  borderRadius: 16,
  boxShadow: `0 8px 16px ${polywrapPalette.secondary[900]}`,
  color: polywrapPalette.secondary['900'],
  fontWeight: 700,
  lineHeight: 2.75,
  fontSize: "1rem",
  padding: "5px 15px",
  transform: 'translateY(0)',
  transition: 'background 0.25s ease-in-out, transform 0.25s ease-in-out',
  '&:hover': {
  backgroundPositionX: '30%',
    transform: 'translateY(-1px)'
  },
  '& .MuiButton-endIcon': {
    marginLeft: 4
  },
  [theme.breakpoints.down('lg')]: {
    margin: "2rem",
  },
}));

interface Props {
  setMetadata: React.Dispatch<React.SetStateAction<MetaData | undefined>>
}

export const FetchMetadata: React.FC<Props> = ({ setMetadata }: Props) => {
  const client = useWeb3ApiClient();

  const [uri, setUri] = React.useState('');

  const onChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    setUri(event.target.value);
  };

  const fetchHandler = async (event: FormEvent<HTMLFormElement>): Promise<any> => {
    event.preventDefault();
    if (!uri) {
      return;
    }
    if (!Uri.isValidUri(uri)) {
      setMetadata({
        format: "0.0.1-prealpha.3",
        displayName: "Invalid URI",
        subtext: "Need help? Check out our docs using the link in the header.",
        __type: "MetaManifest",
      })
      return;
    }

    try {
      const metaData: MetaData = await client.getManifest(uri, {type: "meta"});
      if (metaData.icon) {
        const imageBuffer: ArrayBuffer = await client.getFile(uri, {path: metaData.icon}) as ArrayBuffer;
        metaData.iconImage = Buffer.from(imageBuffer).toString("base64");
      }
      if (metaData.links) {
        for (const link of metaData.links) {
          if (!link.icon) {
            continue;
          }
          const imageBuffer: ArrayBuffer = await client.getFile(uri, {path: link.icon}) as ArrayBuffer;
          link.iconImage = Buffer.from(imageBuffer).toString("base64");
        }
      }
      setMetadata(metaData);
    }
    catch {
      setMetadata({
        format: "0.0.1-prealpha.3",
        displayName: "Failed to resolve URI",
        subtext: "Metadata is optional. Does the wrapper declare a Meta Manifest?",
        __type: "MetaManifest",
      })
    }
  };

  return (
    <SectionContainer container direction="column" justifyContent="flex-start" alignItems="center" spacing={2}>
      <Grid item>
        <Typography variant={"h3"}>Polywrapper Metadata</Typography>
      </Grid>
      <Grid item>
        <Typography variant={"subtitle2"}>
          Enter a <Link
            href='https://docs.polywrap.io/concepts/understanding-uris'
            target='_blank'
            rel="noopener"
            underline={"hover"}
            sx={{color: polywrapPalette.primary.start}}>
            wrap protocol URI
          </Link> to fetch its metadata:
        </Typography>
      </Grid>
      <Grid item>
        <UriForm onSubmit={(event) => fetchHandler(event)}>
          <UriInput
            placeholder='wrap uri'
            onChange={(event) => onChangeHandler(event)}
          />
          <FetchButton type='submit'>Fetch</FetchButton>
        </UriForm>
      </Grid>
      <Grid item>
        <Typography variant={"subtitle2"}>
          <strong>Want to build your own Polywrapper?</strong>
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant={"subtitle2"}><strong>
          <Link
            href='https://docs.polywrap.io/'
            target='_blank'
            rel="noopener noreferrer"
            underline={"hover"}
            sx={{color: polywrapPalette.primary.start}}>
            Check out our documentation
          </Link>
        </strong></Typography>
      </Grid>
    </SectionContainer>
  );
};

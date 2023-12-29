import {styled} from "@mui/material/styles";


export const H2 = styled('h2')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    fontSize: '20px',
}));


import moment from "moment";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@material-ui/core";

const AccountProfile = ({ props }) => (
  <Card {...props}>
    <CardContent>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Avatar
          style={{ width: "30%", height: "30%" }}
          alt="Remy Sharp"
          src={`https://firebasestorage.googleapis.com/v0/b/bookshoponline-85349.appspot.com/o/user%2F${props?.avatar}?alt=media`}
        />
        <br />
        <Typography color="textPrimary" gutterBottom variant="h5">
          {props.fullname}
        </Typography>
      </Box>
    </CardContent>
    <Divider />
    <CardActions>
      <Button color="primary" fullWidth variant="text">
        Upload picture
      </Button>
    </CardActions>
  </Card>
);

export default AccountProfile;

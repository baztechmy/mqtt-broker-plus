## Requirements
- npm
- typescript
- postgresql
- database manager e.g. dbeaver (optional)

## How to setup

1. Clone the project into your local device:\
   `git clone https://github.com/baztechmy/mqtt-broker-plus.git`
   
2. Open the `./.npmrc` file, add the authorization key (In order to install custom made npm modules used in the project)

   <img width="615" height="121" alt="Contents of .npmrc" src="https://github.com/user-attachments/assets/7335e043-e5f7-4153-8460-6eb5dd4ab3ec" />

3. Add the authorization token next to `_authToken=`.
   > Token must be requested from the npm module author @harrypoggers
   
4. Run `npm run install` to install all the required modules for this nodejs project
   > You must have typescript installed prior. Run `npm install -g typescript` to install it globally on your machine
   
5. Run `npm run senvbr`. This will generate a `.env` file which is used to configure the mqtt broker.
   
6. Once the `.env` has been correctly configured, Run `npm run sddbr`. This will generate the necessary tables and dummy data for users and devices in the postgre database.
   > Keep in mind, you must have postgresql installed and configured before testing this project

   Sample of generated device table:\
   <img width="484" height="163" alt="devices table data sample" src="https://github.com/user-attachments/assets/47a38c91-c696-4f8e-9545-4b2a9f4cc329" />
   
   Sample of generated users table:\
   <img width="469" height="153" alt="users table data sample" src="https://github.com/user-attachments/assets/5eb90aad-b7ab-4fed-9d29-f7137e7ce662" />

   Additionally, a dummy token will also be generated and displayed on the terminal

   Sample of generated dummy token:\
   <img width="785" height="147" alt="dummy token sample" src="https://github.com/user-attachments/assets/2ba90ead-f5da-4f4b-8a13-0ca66d9f498f" />

7. Finally, run `npm run br`. This will start the MQTT Broker instance.

   Sample output:\
   <img width="481" height="90" alt="image" src="https://github.com/user-attachments/assets/06e204df-211c-42c9-b00c-7b990cac41d3" />

## Extra Notes
- Using a database manager, like dbeaver, users and devices can be created, read, updated and deleted.
  <img width="847" height="289" alt="dbeaver example" src="https://github.com/user-attachments/assets/2fbcddf3-e504-43c8-90ec-af4ca99eff44" />

  The `device_name` and `device_token` fields are what replaces the username and password field in the MQTT authentication.

import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Text,
  TextField,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  const [invoices, setInvoices] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState(null);

  useEffect(() => {
    const subscription = client.models.Invoice.observeQuery().subscribe({
      next: (data) => setInvoices([...data.items]),
    });
    return () => subscription.unsubscribe(); // Cleanup subscription
  }, []);

  async function createInvoice(event) {
    event.preventDefault();
    const form = new FormData(event.target);

    await client.models.Invoice.create({
      customerName: form.get("customerName"),
      customerAddress: form.get("customerAddress"),
      date: form.get("date"),
      invoiceNo: form.get("invoiceNo"),
      description: form.get("description"),
      invoiceTotal: parseFloat(form.get("invoiceTotal")),
    });

    event.target.reset();
  }

  async function deleteInvoice({ id }) {
    await client.models.Invoice.delete({ id });
  }

  async function updateInvoice(event) {
    event.preventDefault();
    const form = new FormData(event.target);

    await client.models.Invoice.update({
      id: editingInvoice.id,
      customerName: form.get("customerName"),
      customerAddress: form.get("customerAddress"),
      date: form.get("date"),
      invoiceNo: form.get("invoiceNo"),
      description: form.get("description"),
      invoiceTotal: parseFloat(form.get("invoiceTotal")),
    });

    setEditingInvoice(null);
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    scrollToTop();
  };

  return (
    <Authenticator>
      {({ signOut }) => (
        <Flex
          className="App"
          justifyContent="center" 
          alignItems="center"
          direction="column"
          width="90%"
          maxWidth="1200px"
          margin="2rem auto"
          backgroundColor="#f8f9fa"
          padding="2rem"
          borderRadius="15px"
          boxShadow="0 4px 6px rgba(0,0,0,0.1)"
        >
          <Heading level={1} style={{color: "#2c3e50", marginBottom: "2rem"}}>Invoice Tracker</Heading>
          <View 
            as="form" 
            margin="3rem 0" 
            onSubmit={editingInvoice ? updateInvoice : createInvoice}
            backgroundColor="white"
            padding="2rem"
            borderRadius="10px"
            boxShadow="0 2px 4px rgba(0,0,0,0.05)"
            width="100%"
            maxWidth="600px"
          >
            <Flex
              direction="column"
              justifyContent="center"
              gap="1.5rem"
              padding="1rem"
            >
              <TextField
                name="customerName"
                placeholder="Customer Name"
                label="Customer Name"
                labelHidden
                variation="quiet"
                required
                backgroundColor="#fff"
                borderRadius="8px"
                defaultValue={editingInvoice?.customerName}
              />
              <TextField
                name="customerAddress"
                placeholder="Customer Address"
                label="Customer Address"
                labelHidden
                variation="quiet"
                required
                backgroundColor="#fff"
                borderRadius="8px"
                defaultValue={editingInvoice?.customerAddress}
              />
              <TextField
                name="date"
                placeholder="Date"
                label="Date"
                type="date"
                labelHidden
                variation="quiet"
                required
                backgroundColor="#fff"
                borderRadius="8px"
                defaultValue={editingInvoice?.date}
              />
              <TextField
                name="invoiceNo"
                placeholder="Invoice Number"
                label="Invoice Number"
                labelHidden
                variation="quiet"
                required
                backgroundColor="#fff"
                borderRadius="8px"
                defaultValue={editingInvoice?.invoiceNo}
              />
              <TextField
                name="description"
                placeholder="Description"
                label="Description"
                labelHidden
                variation="quiet"
                required
                backgroundColor="#fff"
                borderRadius="8px"
                defaultValue={editingInvoice?.description}
              />
              <TextField
                name="invoiceTotal"
                placeholder="Invoice Total"
                label="Invoice Total"
                type="number"
                step="0.01"
                labelHidden
                variation="quiet"
                required
                backgroundColor="#fff"
                borderRadius="8px"
                defaultValue={editingInvoice?.invoiceTotal}
              />
              <Button 
                type="submit" 
                variation="primary"
                backgroundColor="#3498db"
                borderRadius="8px"
                padding="1rem"
                fontSize="1.1rem"
                boxShadow="0 2px 4px rgba(0,0,0,0.1)"
                _hover={{ backgroundColor: "#2980b9" }}
              >
                {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
              </Button>
              {editingInvoice && (
                <Button
                  variation="link"
                  onClick={() => setEditingInvoice(null)}
                >
                  Cancel Edit
                </Button>
              )}
            </Flex>
          </View>
          <Divider style={{width: "100%", margin: "2rem 0"}} />
          <Heading level={2} style={{color: "#2c3e50", marginBottom: "2rem"}}>Invoices</Heading>
          <Grid
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            gap="2rem"
            width="100%"
            padding="1rem"
          >
            {invoices.map((invoice) => (
              <Flex
                key={invoice.id || invoice.invoiceNo}
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                gap="1.5rem"
                border="1px solid #e1e8ed"
                padding="2rem"
                borderRadius="12px"
                backgroundColor="white"
                boxShadow="0 2px 4px rgba(0,0,0,0.05)"
                transition="transform 0.2s ease"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }}
              >
                <View width="100%" textAlign="center">
                  <Heading level={3} style={{color: "#2c3e50", marginBottom: "0.5rem"}}>{invoice.customerName}</Heading>
                </View>
                <Text fontStyle="italic" color="#7f8c8d">{invoice.customerAddress}</Text>
                <Text fontStyle="italic" color="#7f8c8d">{invoice.date}</Text>
                <Text fontStyle="italic" color="#7f8c8d">#{invoice.invoiceNo}</Text>
                <Text color="#34495e">{invoice.description}</Text>
                <Text fontWeight="bold" fontSize="1.2rem" color="#27ae60">${invoice.invoiceTotal.toFixed(2)}</Text>
                <Flex gap="1rem" width="100%">
                  <Button
                    variation="link"
                    onClick={() => handleEdit(invoice)}
                    width="100%"
                    borderRadius="8px"
                    backgroundColor="#f39c12"
                    color="white"
                    _hover={{ backgroundColor: "#d35400" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variation="destructive"
                    onClick={() => deleteInvoice(invoice)}
                    borderRadius="8px"
                    backgroundColor="#e74c3c"
                    _hover={{ backgroundColor: "#c0392b" }}
                  >
                    Delete
                  </Button>
                </Flex>
              </Flex>
            ))}
          </Grid>
          <Button 
            onClick={signOut}
            marginTop="2rem"
            backgroundColor="#95a5a6"
            color="white"
            borderRadius="8px"
            _hover={{ backgroundColor: "#7f8c8d" }}
          >
            Sign Out
          </Button>
        </Flex>
      )}
    </Authenticator>
  );
}

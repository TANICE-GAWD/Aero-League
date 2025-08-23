import { apiSlice } from "./apiSlice";

export const ticketApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query({
      query: () => '/tickets/view/',
      method: 'GET',
    }),
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: '/tickets/message/',
        method: 'POST',
        body: messageData,
      }),
    }),
    markMessageRead: builder.mutation({
      query: (message) => ({
        url: `/tickets/mark-as-read/`,
        method: 'POST',
        body: message,
      }),
    }),
    createTicket: builder.mutation({
      query: (ticketData) => ({
        url: '/tickets/create/',
        method: 'POST',
        body: ticketData,
      }),
    }),
    closeTicket: builder.mutation({
      query: (ticketId) => ({
        url: `/tickets/mark-as-closed/`,
        method: 'POST',
        body: { ticket_id: ticketId },
      }),
    }),
  }),
});

export const { useGetTicketsQuery, useSendMessageMutation, useMarkMessageReadMutation, useCreateTicketMutation, useCloseTicketMutation } = ticketApiSlice;

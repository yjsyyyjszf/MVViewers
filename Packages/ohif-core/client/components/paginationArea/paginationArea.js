import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import 'twbs-pagination';

const visiblePages = 10;

Template.paginationArea.onCreated(function() {
    const instance = Template.instance();
    const defaultValue = instance.data.rowsPerPage.get();

    // Create the rowsPerPage schema
    instance.schema = new SimpleSchema({
        rowsPerPage: {
            type: Number,
            allowedValues: [25, 50, 100],
            defaultValue: defaultValue
        }
    });
});

Template.paginationArea.onRendered(() => {
    const instance = Template.instance();

    // Track changes on recordCount and rowsPerPage
    instance.autorun(() => {
        instance.$paginationControl = instance.$('.pagination-control');
        const recordCount = instance.data.recordCount.get();
        const rowsPerPage = instance.data.rowsPerPage.get();

        // Destroy plugin if exists
        if (instance.$paginationControl.data().twbsPagination) {
            instance.$paginationControl.twbsPagination('destroy');
        }

        if (recordCount && rowsPerPage) {
            const totalPages = Math.ceil(recordCount / rowsPerPage);

            // Initialize plugin
            instance.$paginationControl.twbsPagination({
                totalPages,
                visiblePages,
                startPage: 1,
                first: '首页',
                prev: '上页',
                next: '下页',
                last: '末页',
                initiateStartPageClick: false,
                onPageClick: (event, page) => {
                    // Update currentPage
                    // Decrease page by 1 to set currentPage
                    // Since reactive table current page index starts by 0
                    instance.data.currentPage.set(page - 1);

                }
            });
        }
    });
});

Template.paginationArea.onDestroyed(() => {
    const instance = Template.instance();
    if (instance.$paginationControl.data().twbsPagination) {
        instance.$paginationControl.twbsPagination('destroy');
    }
});

Template.paginationArea.helpers({
    recordCount() {
        const instance = Template.instance();
        return instance.data.recordCount.get();
    },

    isRowsPerPageSelected(rowsPerPage) {
        const instance = Template.instance();
        return rowsPerPage === instance.data.rowsPerPage.get();
    }
});

Template.paginationArea.events({
    'change [data-key=rowsPerPage]'(event, instance) {
        const rowsPerPage = $(event.currentTarget).data('component').value();
        instance.data.rowsPerPage.set(parseInt(rowsPerPage, 10));
    }
});
